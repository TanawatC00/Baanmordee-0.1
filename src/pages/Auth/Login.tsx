
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Navbar from '@/components/Layout/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email({ message: "กรุณาระบุอีเมลให้ถูกต้อง" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
});

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่าผู้ใช้ล็อกอินอยู่แล้วหรือไม่
    const checkLogin = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkLogin();
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        // แสดงข้อความข้อผิดพลาดที่เฉพาะเจาะจงมากขึ้น
        let errorMessage = error.message;
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "อีเมลของคุณยังไม่ได้ยืนยัน โปรดตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี";
        }
        
        toast.error("เข้าสู่ระบบล้มเหลว", {
          description: errorMessage,
        });
        
        console.error("Login error:", error);
        return;
      }

      // หากสำเร็จ
      if (data.session) {
        const userEmail = data.user?.email || 'ผู้ใช้';
        
        toast.success("เข้าสู่ระบบสำเร็จ", {
          description: `ยินดีต้อนรับกลับมา ${userEmail}`,
        });
        
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error("เกิดข้อผิดพลาด", {
        description: "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-medical-blue">
              เข้าสู่ระบบ
            </CardTitle>
            <CardDescription className="text-center">
              กรอกข้อมูลเพื่อเข้าสู่ระบบ บ้านหมอดี
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>อีเมล</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
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
                      <FormLabel>รหัสผ่าน</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="รหัสผ่าน" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-medical-blue hover:bg-medical-blue/90"
                  disabled={isLoading}
                >
                  {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm">
              ยังไม่มีบัญชี?{" "}
              <Link to="/register" className="text-medical-blue hover:underline">
                สมัครสมาชิกใหม่
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      
      <footer className="bg-white shadow-inner py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 บ้านหมอดี - ระบบตรวจสอบอาการเบื้องต้น</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;