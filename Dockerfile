FROM android-emulator:latest
WORKDIR /
COPY . /
RUN npm i