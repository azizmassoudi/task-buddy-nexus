import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../src/redux/store';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.role;
  const navigation = useNavigation();

  useEffect(() => {
    if (role === 'admin') {
      navigation.navigate('AdminDashboard' as never);
    } else if (role === 'client') {
      navigation.navigate('ClientDashboard' as never);
    } else if (role === 'subcontractor') {
      navigation.navigate('ContractorDashboard' as never);
    } else {
      navigation.navigate('Index' as never);
    }
  }, [role, navigation]);

  return null;
};

export default Dashboard;