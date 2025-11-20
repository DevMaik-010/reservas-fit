FROM node:24.10.0-alpine3.22

# Install dependencies and Bun
RUN apk add --no-cache unzip curl bash && \
    curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun

WORKDIR /app
COPY package*.json .
RUN bun install 

COPY . .
EXPOSE 3030

CMD ["bun", "run", "dev", "--", "-H", "0.0.0.0", "--port", "3030"]
