FROM amrka/android-emulator:nexus6_playstore-latest
WORKDIR /
COPY . /
RUN npm i