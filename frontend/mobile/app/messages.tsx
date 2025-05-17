import { useSelector } from 'react-redux';
import { RootState } from '../src/redux/store';

const Messages = () => {
  const { messages } = useSelector((state: RootState) => state.messages);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
        <div className="mt-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="border-b pb-4">
              <p className="text-gray-600">{message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages; 