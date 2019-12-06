/*
 * WebSocketClient.ino-p0
 *
 *  Created on: 24.05.2015
 *
 */

#include <Arduino.h>

#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>

#include <WebSocketsClient.h>


WiFiMulti WiFiMulti;
WebSocketsClient webSocket;


//assigning pins
const int echoPin = 26;
const int trigPin = 25;
const int buttonTouch = 27;
const int id = 1;

//Setting variables for pin values
float duration, distance;
int buttonState = 0;
int isSpotAvailable = 0;

#define USE_SERIAL Serial

void hexdump(const void *mem, uint32_t len, uint8_t cols = 16) {
	const uint8_t* src = (const uint8_t*) mem;
	USE_SERIAL.printf("\n[HEXDUMP] Address: 0x%08X len: 0x%X (%d)", (ptrdiff_t)src, len, len);
	for(uint32_t i = 0; i < len; i++) {
		if(i % cols == 0) {
			USE_SERIAL.printf("\n[0x%08X] 0x%08X: ", (ptrdiff_t)src, i);
		}
		USE_SERIAL.printf("%02X ", *src);
		src++;
	}
	USE_SERIAL.printf("\n");
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {

	switch(type) {
		case WStype_DISCONNECTED:
			USE_SERIAL.printf("[WSc] Disconnected!\n");
			break;
		case WStype_CONNECTED:
			USE_SERIAL.printf("[WSc] Connected to url: %s\n", payload);

			// send message to server when Connected
			webSocket.sendTXT("Connected");
			break;
		case WStype_TEXT:
			USE_SERIAL.printf("[WSc] get text: %s\n", payload);

			// send message to server
			// webSocket.sendTXT("message here");
			break;
		case WStype_BIN:
			USE_SERIAL.printf("[WSc] get binary length: %u\n", length);
			hexdump(payload, length);

			// send data to server
			// webSocket.sendBIN(payload, length);
			break;
		case WStype_ERROR:			
		case WStype_FRAGMENT_TEXT_START:
		case WStype_FRAGMENT_BIN_START:
		case WStype_FRAGMENT:
		case WStype_FRAGMENT_FIN:
			break;
	}

}

void setup() {
	// USE_SERIAL.begin(921600);
	USE_SERIAL.begin(115200);

	//Serial.setDebugOutput(true);
	USE_SERIAL.setDebugOutput(true);

	USE_SERIAL.println();
	USE_SERIAL.println();
	USE_SERIAL.println();

  //Setting pinmode for sensors
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buttonTouch, INPUT);

	for(uint8_t t = 4; t > 0; t--) {
		USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
		USE_SERIAL.flush();
		delay(1000);
	}

  //WiFiMulti.addAP("Frederiks iPhone", "12345676");
  //WiFiMulti.addAP("Aaparken6-1-1 2.4", "hallo123");
  WiFiMulti.addAP("Jonas iPhone", "hallo123");

	//WiFi.disconnect();
	while(WiFiMulti.run() != WL_CONNECTED) {
    USE_SERIAL.print("NO WIFI");
		delay(100);
	}

	// server address, port and URL
	webSocket.begin("polar-sands-87869.herokuapp.com", 80, "/");

	// event handler
	webSocket.onEvent(webSocketEvent);

	// try ever 5000 again if connection has failed
	webSocket.setReconnectInterval(5000);

}

void loop() {

  DynamicJsonDocument doc(1024);
  
  JsonObject root = doc.to<JsonObject>();

  // put your main code here, to run repeatedly:
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  buttonState = digitalRead(buttonTouch);
  


  duration = pulseIn(echoPin, HIGH);
  distance = (duration*.0343)/2;

  if(buttonState == 0 && distance > 50) {
    isSpotAvailable = 1;
  }
  else {
    isSpotAvailable = 0;
  }

  //Serial.print("button: ");
  //Serial.print(buttonState);
  //Serial.print("Distance: ");
  //Serial.print(distance);
  //Serial.print("avail: ");
  //Serial.print(isSpotAvailable);

  
	webSocket.loop();

  root["id"] = String(id);
  root["status"] = String(isSpotAvailable);

  String json = "";

  serializeJson(doc, json);

  Serial.println(json);

  
  delay(1000);
  
  webSocket.sendTXT(json);
}
