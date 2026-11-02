FROM node:20-alpine AS builder
WORKDIR /FYPfrontend
COPY package*.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /FYPfrontend
ENV NODE_ENV production
COPY --from=builder /FYPfrontend/public ./public
COPY --from=builder --chown=node:node /FYPfrontend/.next/standalone ./
COPY --from=builder --chown=node:node /FYPfrontend/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]