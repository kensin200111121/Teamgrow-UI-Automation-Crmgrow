
FROM webdriverio/selenium-standalone

WORKDIR /app

COPY package*.json ./

RUN mkdir -p /reports

COPY . .

COPY ./reports /reports

RUN npm install --force

# Install Display
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    xvfb

# # Install Chrome
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome-archive-keyring.gpg
# RUN echo 'deb [signed-by=/usr/share/keyrings/google-chrome-archive-keyring.gpg arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' > /etc/apt/sources.list.d/google-chrome.list
# RUN apt-get update && apt-get install -y \
#     google-chrome-stable

CMD xvfb-run -a npm run $TEST_ITEM


