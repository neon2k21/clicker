import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Svg, Path } from 'react-native-svg';
import MainScreen from '../screens/main_screen';
import ShopScreen from '../screens/shop_screen';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const color = focused ? 'orange' : 'gray';
          
          const icons = {
            'Главный': (
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M3 9L12 2L21 9V20H3V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            ),
            'Магазин': (
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M3 3H21V7H3V3ZM5 7V21H19V7H5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            )
          };
          
          return icons[route.name];
        },
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'gray'
      })}
    >
      <Tab.Screen name="Главный" component={MainScreen} />
      <Tab.Screen name="Магазин" component={ShopScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
