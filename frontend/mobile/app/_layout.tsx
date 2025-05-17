import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor, RootState } from "../src/redux/store";
import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";
import Layout from "./layout";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.navigate("/login");
    } else {
      router.navigate("/" as never);
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthGate>
          <Layout>
            <Slot />
          </Layout>
        </AuthGate>
      </PersistGate>
    </Provider>
  );
}
