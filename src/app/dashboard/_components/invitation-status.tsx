"use client";

import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function InvitationStatus() {
  const searchParams = useSearchParams();
  const [showAlert, setShowAlert] = useState(false);

  const invitation = searchParams.get("invitation");
  const error = searchParams.get("error");
  const message = searchParams.get("message");
  const invitationId = searchParams.get("invitation_id");

  useEffect(() => {
    if (invitation || error) {
      setShowAlert(true);
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [invitation, error]);

  if (!showAlert || (!invitation && !error)) {
    return null;
  }

  if (invitation === "accepted") {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">
          Convite aceito com sucesso!
        </AlertTitle>
        <AlertDescription className="text-green-700">
          Você foi adicionado à organização e agora tem acesso a todas as
          funcionalidades.
        </AlertDescription>
      </Alert>
    );
  }

  if (error === "invitation_not_found") {
    return (
      <Alert className="border-red-200 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">Convite não encontrado</AlertTitle>
        <AlertDescription className="text-red-700">
          O convite pode ter expirado, já ter sido usado ou o ID do convite é
          inválido.
          {invitationId && (
            <div className="mt-2 font-mono text-sm">
              ID do convite: {invitationId}
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (error === "invitation_error") {
    return (
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-800">
          Erro ao aceitar convite
        </AlertTitle>
        <AlertDescription className="text-orange-700">
          {message ||
            "Ocorreu um erro ao processar o convite. Tente novamente ou entre em contato com o administrador."}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
