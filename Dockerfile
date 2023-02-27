FROM --platform=linux/amd64 amrka/android-emulator:latest
WORKDIR /
COPY . /
RUN npm i