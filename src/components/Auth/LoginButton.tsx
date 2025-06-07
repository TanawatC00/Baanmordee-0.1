
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

const LoginButton: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status from Supabase
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    // Check initial session
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("ออกจากระบบล้มเหลว", {
          description: error.message,
        });
        return;
      }
      
      setIsLoggedIn(false);
      toast.info("ออกจากระบบแล้ว", {
        description: "พบกันใหม่เร็วๆนี้",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("เกิดข้อผิดพลาด", {
        description: "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <Button 
          variant="outline" 
          onClick={handleLogout}
          disabled={isLoading}
          className="border-medical-blue text-medical-blue hover:bg-medical-blue/10"
        >
          {isLoading ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
        </Button>
      ) : (
        <Button 
          onClick={handleLogin}
          className="bg-medical-blue hover:bg-medical-blue/90 text-white"
        >
          เข้าสู่ระบบ
        </Button>
      )}
    </>
  );
};

export default LoginButton;