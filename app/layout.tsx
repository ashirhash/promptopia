import "styles/globals.css";
import Nav from "components/Nav";
import Provider from "components/Provider";

export const metadata = {
  title: "Promptopia",
  description: "Discover & Share AI Prompts",
};

interface LayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <body>
        <Provider>
          <div className="main">
            <div className="gradient" />
          </div>

          <main className="app">
            <Nav />
            <div className="container">{children}</div>
          </main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
