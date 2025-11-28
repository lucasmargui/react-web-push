import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { User, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { URL } from "@/config"

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
      console.log()
      const res = await fetch(`${URL}/admin/clear-json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json(); // se a resposta for JSON

      console.log(data)

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
  <div className="flex min-h-screen items-center justify-center p-8 ">

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
        w-full 
        max-w-2xl 
        bg-white/80 
        backdrop-blur-xl 
        rounded-3xl 
        shadow-[0_8px_40px_rgba(0,0,0,0.08)] 
        border border-white/40 
        overflow-hidden
        flex flex-col
      "
    >
      {/* ====================== Avatar TOP ====================== */}
      <div className="flex flex-col items-center gap-4 p-10 bg-gradient-to-b from-primary/30 to-primary/60 text-white">

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 180 }}
          className="h-36 w-36 rounded-full bg-white shadow-2xl shadow-black/20 flex items-center justify-center"
        >
          <User className="h-24 w-24 text-primary" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-medium tracking-wide text-white/90"
        >
          Perfil do Usuário
        </motion.h2>
      </div>

      {/* ====================== Informações ====================== */}
      <div className="p-10 space-y-8">

        {/* Header + botão limpar */}
        <div className="flex items-start justify-between">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl font-bold text-gray-900 leading-tight"
          >
            {user.name}
          </motion.h1>

          <Button
            variant="destructive"
            size="sm"
            className="shadow-md hover:shadow-lg transition-shadow"
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
                Limpar
              </>
            )}
          </Button>
        </div>

        {/* Dados */}
        <div className="flex flex-col gap-6 text-gray-700">

          <InfoItem label="ID" value={user.id} />
          <InfoItem label="Email" value={user.email} />

          {/* Função */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">Função:</span>
            <span
              className={`
                px-4 py-1.5 rounded-full text-xs font-semibold text-white
                ${user.role === "Administrator" ? "bg-red-600" : "bg-blue-600"}
              `}
            >
              {user.role}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">Status:</span>
            <span
              className={`
                px-4 py-1.5 rounded-full text-xs font-semibold text-white
                ${user.status === "Active" ? "bg-green-600" : "bg-gray-400"}
              `}
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
          className="inline-block text-primary font-medium hover:underline pt-4"
        >
          ← Voltar para Home
        </motion.a>
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
