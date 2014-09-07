Team Stardust:

Yajing Tang(yajingt)
Chen Feng(cfeng)
Tianyao Xu(tianyaox)

Project description:

Our "Online-Band" is a cross-platform mobile web app. As phonegap and native-plugins are used in this app, it can be built like a native app on an android phone or iphone. The use of phonegap and native-plugins may make it hard to be easily tested. The way to build the app will be talked later.

Our "Online-Band" app allows the users to form their virtual band and play music with other users online. After a simple register/login, the user can enter the lobby to create their own room or join other's rooms. After entering the room, four instruments can be selected, including guitar, bass, piano and drum. The holder of the room can record the tracks the room members played and store them in the database. The stored tracked can be extracted from the database and  replayed later.

The app was written for both android phone and iphone, using their own native-plugins respectively. 
For the android version, the whole project folder can be imported into Eclipse. If the Eclipse has the necessary phonegap plugins, the app can be easily built into a real android device. 
For the ios version, there is a xcode-project file in the folder, which can be started with xcode. Using the iphone simulator in xcode, the app can be built.

For the server-side, we only submitted the js files. It require the use of node_modules, including express, mongoDb and socket.io.

=========================================
Image Credtis:

The Images Sources:

Jam with Google
http://www.jamwithchrome.com/

Apple Garage Band
http://www.apple.com/ilife/garageband/

Zcool Vector Resource
http://www.zcool.com.cn/
=========================================