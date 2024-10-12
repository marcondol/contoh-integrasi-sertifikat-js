FROM node:20

WORKDIR /app
COPY . .

RUN mkdir -p /app/outputpdf
RUN npm install registry.npmjs.org
EXPOSE 4000
CMD ["npm", "start"]
