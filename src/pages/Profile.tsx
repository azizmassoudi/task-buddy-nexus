import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        <div className="mt-4">
          <p className="text-gray-600">Name: {user?.name}</p>
          <p className="text-gray-600">Email: {user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile; 