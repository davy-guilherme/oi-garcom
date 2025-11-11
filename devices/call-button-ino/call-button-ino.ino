#include <WiFi.h>
#include <PubSubClient.h>

// --- CONFIGURAÇÕES ---
const char* ssid = "Quintal";
const char* password = "quintal@2025";
const char* mqtt_server = "quintal.local";
const int mqtt_port = 1883;
const char* mqtt_topic = "chamar_garcom/2";

// --- OBJETOS ---
WiFiClient espClient;
PubSubClient client(espClient);

// --- PINO DO BOTÃO ---
const int botaoPin = 22;
int ultimoEstadoBotao = HIGH;

// --- FUNÇÕES ---
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando-se à rede: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("Wi-Fi conectado!");
  Serial.print("Endereço IP: ");
  Serial.println(WiFi.localIP());
}


void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando ao broker MQTT em ");
    Serial.print(mqtt_server);
    Serial.print(":");
    Serial.println(mqtt_port);

    if (client.connect("ESP32Client")) {
      Serial.println("Conectado ao MQTT!");
    } else {
      int state = client.state();
      Serial.print("Falhou, rc=");
      Serial.print(state);
      Serial.println(" — tentando novamente em 5 segundos");

      if (state == -2) Serial.println("Falha de rede (broker inacessível)");
      if (state == -4) Serial.println("Timeout ao tentar conectar");
      if (state == 2) Serial.println("ID de cliente inválido");
      if (state == 5) Serial.println("Não autorizado");
      delay(2000);
    }
  }
}


void setup() {
  pinMode(botaoPin, INPUT_PULLUP);
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  int estadoAtualBotao = digitalRead(botaoPin);

  // Detecta mudança de HIGH -> LOW (botão pressionado)
  if (ultimoEstadoBotao == HIGH && estadoAtualBotao == LOW) {
    Serial.println("Botão pressionado!");
    client.publish(mqtt_topic, "botao_pressionado");
    delay(300); // debounce simples???
  }

  ultimoEstadoBotao = estadoAtualBotao;
}
