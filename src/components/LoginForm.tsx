
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";
import { mockUsers } from "@/utils/mockData";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

interface LoginFormProps {
  onLoginSuccess: (userId: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const user = mockUsers.find(user => 
      user.email === values.email && user.password === values.password
    );
    
    if (user) {
      // Clear any previous errors
      setError(null);
      // Call the login success callback with the user ID
      onLoginSuccess(user.id);
    } else {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-healthcare-primary">
        <CardHeader className="text-center bg-gradient-to-r from-healthcare-light to-white">
          <CardTitle className="text-2xl font-bold">HealthPerform AI</CardTitle>
          <CardDescription>Sign in to access the performance management system</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@healthperform.org" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-healthcare-primary hover:bg-healthcare-primary/90">
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-sm text-gray-500">
          <div>Demo Accounts:</div>
          <div className="grid grid-cols-3 gap-2 w-full text-xs">
            <div>admin@healthperform.org<br/>admin123</div>
            <div>manager@healthperform.org<br/>manager123</div>
            <div>viewer@healthperform.org<br/>viewer123</div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
