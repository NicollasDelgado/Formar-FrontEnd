#!/bin/bash

# Define o nome do arquivo de versão
VERSION_FILE="VERSION"

# Nome da sua imagem Docker
IMAGE_NAME="formar-frontend"

# Porta utilizada
PORT=3000

# Verifica se o arquivo de versão existe e cria se necessário
if [ -f "$VERSION_FILE" ]; then
  echo "Arquivo de versão '$VERSION_FILE' encontrado."
else
  echo "Arquivo de versão '$VERSION_FILE' não encontrado. Criando com versão inicial 0.0.0."
  echo "0.0.0" > "$VERSION_FILE"
fi

# Lê a versão atual do arquivo, ou inicia com 0.0.0 caso o arquivo não exista
if [ -f "$VERSION_FILE" ]; then
  CURRENT_VERSION=$(cat "$VERSION_FILE")
else
  CURRENT_VERSION="0.0.0"
fi

# Incrementa a versão
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$PATCH"

# Atualiza o arquivo de versão
echo "$NEW_VERSION" > "$VERSION_FILE"
echo "Nova versão: $NEW_VERSION"

# Exporta a versão para o ambiente para ser usada pelo docker-compose
export VERSION="$NEW_VERSION"
export IMAGE_NAME="$IMAGE_NAME"
export PORT="$PORT"
echo "Versão exportada: $VERSION"

# Encontra o ID da última imagem
LAST_IMAGE=$(docker images --filter "reference=$IMAGE_NAME" -q | tail -n 1)

# Encontra o ID do container em execução
LAST_CONTAINER=$(docker ps -aqf "name=$IMAGE_NAME")

# Para e remove o último container
if [[ -n "$LAST_CONTAINER" ]]; then
  echo "Parando e removendo o container antigo: $LAST_CONTAINER"
  docker stop $LAST_CONTAINER
  docker rm $LAST_CONTAINER --force
fi

# Remove a última imagem
if [ -n "$LAST_IMAGE" ]; then
  echo "Removendo a imagem antiga: $LAST_IMAGE"
  docker stop $LAST_CONTAINER
  docker rmi $LAST_IMAGE --force
fi

# Constrói as imagens com a nova versão
docker-compose build

# Verifica se a construção ocorreu com sucesso
if [ $? -ne 0 ]; then
  echo "Erro durante a construção da imagem. Verifique os logs do Docker para mais detalhes."
  exit 1
fi

# Sobe os containers usando as imagens recém-buildadas
echo "Subindo os containers..."
docker-compose up -d

echo "Build concluído com a versão $NEW_VERSION"