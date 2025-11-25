import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { User, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import NotificationBanner from "@/components/ui/banner";

const UserInfo = () => {

  const [user, setUser] = useState<any>(null);
  const [clearing, setClearing] = useState(false);
  const { toast } = useToast();

  // ======================
  // Carrega dados mockados
  // ======================
  useEffect(() => {
    const mockUser = {
      id: "12345",
      name: "Lucas Silva",
      email: "lucas@example.com",
      role: "Administrator",
      joined: "2023-05-01",
      lastLogin: "2025-11-20",
      status: "Active",
    };
    setUser(mockUser);
  }, []);

  // ======================
  // Handler limpar JSON
  // ======================
  const handleClearJson = async () => {
    setClearing(true);
    try {
      const res = await fetch("http://98.93.193.4:7001/admin/clear-json", {
        method: "POST",
      });

      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

      toast({ title: "Limpeza realizada com sucesso!" });
    } catch (error: any) {
      toast({
        title: "Erro ao limpar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setClearing(false);
      location.reload()
    }
  };

  // ======================
  // Loading state
  // ======================
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-gray-400 animate-pulse text-lg font-semibold">
          Carregando dados...
        </p>
      </div>
    );
  }

  // ======================
  // Componente principal
  // ======================
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-gray-50">
      <NotificationBanner />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
      >
        <div className="grid md:grid-cols-3">
          {/* ====================== Avatar ====================== */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-primary/60 p-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 240 }}
              className="flex items-center justify-center bg-white shadow-inner h-32 w-32 rounded-full"
            >
              <User className="h-20 w-20 text-primary" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-sm text-white/90"
            >
              Perfil do Usuário
            </motion.p>
          </div>

          {/* ====================== User Info ====================== */}
          <div className="md:col-span-2 p-8 space-y-6">

            {/* Header + botão limpar */}
            <div className="flex items-start justify-between">
              <motion.h1
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-3xl font-bold text-gray-900"
              >
                {user.name}
              </motion.h1>

              <Button
                variant="destructive"
                size="sm"
                className="shadow-md"
                onClick={handleClearJson}
                disabled={clearing}
              >
                {clearing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Limpando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar JSON
                  </>
                )}
              </Button>
            </div>

            {/* Dados do usuário */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">

              <InfoItem label="ID" value={user.id} />
              <InfoItem label="Email" value={user.email} />

              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Função:</span>
                <span
                  className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                    user.role === "Administrator"
                      ? "bg-red-600"
                      : "bg-blue-600"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                    user.status === "Active"
                      ? "bg-green-600"
                      : "bg-gray-400"
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <InfoItem label="Entrou em" value={user.joined} />
              <InfoItem label="Último Login" value={user.lastLogin} />
            </div>

            {/* Link voltar */}
            <motion.a
              href="/"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-block text-primary font-medium hover:underline mt-4"
            >
              ← Voltar para Home
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserInfo;

// ======================
// Subcomponente: info item
// ======================
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="font-semibold text-gray-900">{label}:</span>{" "}
    <span className="text-gray-700">{value}</span>
  </div>
);
