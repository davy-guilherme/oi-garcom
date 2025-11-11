#!/bin/bash
set -e  # encerra o script se ocorrer algum erro

echo "============================================"
echo " Iniciando instalação do Oi Garçom..."
echo "============================================"

# --- 1. Definir timezone ---
echo "Configurando timezone para America/Sao_Paulo..."
sudo timedatectl set-timezone America/Sao_Paulo
timedatectl

# --- 2. Atualização do sistema ---
echo "Atualizando pacotes..."
sudo apt update -y && sudo apt upgrade -y

# --- 3. Instalação de dependências ---
echo "Instalando dependências básicas..."
sudo apt install -y git curl mariadb-server mosquitto mosquitto-clients

# --- 4. Configurar e habilitar serviços ---
echo "Configurando e iniciando MariaDB e Mosquitto..."
sudo systemctl enable mariadb
sudo systemctl start mariadb
sudo systemctl enable mosquitto
sudo systemctl start mosquitto

# --- 5. Instalar Node.js e PM2 ---
echo "Instalando Node.js e PM2..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

# --- 6. Configurar MariaDB (ajuste usuário/senha conforme seu projeto) ---
echo "Configurando MariaDB..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS oi_garcom;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'garcom_user'@'localhost' IDENTIFIED BY 'senha123';"
sudo mysql -e "GRANT ALL PRIVILEGES ON oi_garcom.* TO 'garcom_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# --- 7. Clonar projeto do GitHub ---
echo "Baixando projeto Oi Garçom..."
cd /home/$USER
if [ ! -d "oi-garcom" ]; then
  git clone https://github.com/seuusuario/oi-garcom.git
else
  echo "Pasta oi-garcom já existe, pulando download..."
fi
cd oi-garcom

# --- 8. Instalar dependências do projeto ---
echo "Instalando dependências do projeto..."
npm install

# --- 9. Configurar e iniciar com PM2 ---
echo "Iniciando projeto com PM2..."
pm2 start server.js --name oi-garcom
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER

# --- 10. Finalização ---
echo "Instalação concluída!"
echo "Verifique o status do projeto com: pm2 list"
echo "Logs disponíveis com: pm2 logs oi-garcom"

## chmod +x setup_oi_garcom.sh
## ./setup_oi_garcom.sh