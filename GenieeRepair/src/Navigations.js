import   {Navigation} from "react-native-navigation";
import Dashboard from "./screens/Dashboard";
import UserList from "./screens/UserList";
import Profile from "./screens/Profile";


Navigation.registerComponent(`Dashboard`, () => Dashboard);
Navigation.registerComponent(`UserList`, () => UserList);
Navigation.registerComponent(`Profile`, () => Profile);

export const goToDashboard= () =>
    Navigation.setRoot({
        root: {
            stack: {
                // create a stack navigation
                id: "stackMain",
                children: [
                    {
                        component: {
                            name: "Dashboard",

                        }
                    }
                ],
                options: {
                    topBar: {
                        visible: false // need to set this because screens in a stack navigation have a header by default
                    }
                },
            }
        }
    });

