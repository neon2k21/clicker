import { View } from "react-native";
import AppNavigation from "./navigation/navigation";
import { SafeAreaView } from 'react-native-safe-area-context';



export default function App() {

  return (
    <SafeAreaView style={{width:'auto', height:'100%'}}>
       <AppNavigation/>
    </SafeAreaView>
   
  );
}
