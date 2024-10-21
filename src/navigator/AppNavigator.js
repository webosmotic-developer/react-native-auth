import PublicStack from './PublicStack';
import {useAuth} from '../context/AuthProvider';
import Dashboard from '../screens/Dashboard';
const AppNavigator = () => {
  const auth = useAuth();
  return auth.userToken == null ? <PublicStack /> : <Dashboard />;
};

export default AppNavigator;
