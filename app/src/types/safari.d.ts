interface Window {
  safari?: {
    pushNotification: {
      permission: (id: string) => {
        permission: "default" | "denied" | "granted";
      };
      requestPermission: (
        url: string,
        id: string,
        data: Record<string, any>,
        callback: (permissionData: { permission: string }) => void
      ) => void;
    };
  };
}
