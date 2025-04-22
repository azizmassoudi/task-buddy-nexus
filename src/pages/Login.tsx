import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice.ts'; // Adjust path as needed
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { RootState, AppDispatch } from '../redux/store'; // Adjust path to your store file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('client');

  const dispatch = useDispatch<AppDispatch>(); // Use typed dispatch
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const defaultCredentials = {
    admin: 'admin@example.com',
    subcontractor: 'contractor@example.com',
    client: 'client@example.com',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Dispatch login thunk and await the payload
      const  user = await dispatch(login({ email, password }));
      toast({
        title: 'Login successful',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error?.message || 'Invalid credentials or user not found',
      });
    }
  };

  const fillDefaultCredentials = (role: string) => {
    if (role) {
      setEmail(defaultCredentials[role]);
      setPassword('password123'); // Demo password
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-10 w-10 bg-brand-300 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Login to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="client" onValueChange={(value) => setSelectedRole(value)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="client">Client</TabsTrigger>
              <TabsTrigger value="subcontractor">Contractor</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            {['client', 'subcontractor', 'admin'].map((role) => (
              <TabsContent key={role} value={role}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-sm text-brand-500 hover:text-brand-600">
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Optional error display */}
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-brand-300 hover:bg-brand-400"
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => fillDefaultCredentials(role)}
                    >
                      Use demo credentials
                    </Button>
                  </div>
                </form>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don't have an account?{' '}
            <a href="/register" className="text-brand-500 hover:text-brand-600 font-medium">
              Create an account
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;