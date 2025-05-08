# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN  yarn install
COPY . .
RUN yarn build

# Stage 2: Run the Next.js application in production
FROM node:18-alpine AS runner
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Set environment variables (if needed)
ENV NODE_ENV production
ENV PORT 3000 # Or the port your app uses

# Install only production dependencies
RUN yarn install --production

EXPOSE 3000

# Command to start the Next.js application in production
CMD ["npm", "start"]
# Or if you have a custom server:
# CMD ["node", "server.js"]