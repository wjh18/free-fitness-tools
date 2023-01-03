import {maxLift} from "./maxLifts.js"
import {calorieTarget} from "./calorieTargets.js"

require('../scss/main.scss');
require('../assets/favicon/site.webmanifest');
require('../assets/favicon/favicon.ico');
require('../assets/favicon/favicon-32x32.png');
require('../assets/favicon/favicon-16x16.png');
require('../assets/favicon/apple-touch-icon.png');
require('../assets/favicon/android-chrome-192x192.png');
require('../assets/favicon/android-chrome-512x512.png');

maxLift.run();
calorieTarget.run();