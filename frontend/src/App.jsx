import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { OrderFlowProvider } from './context/OrderFlowContext'
import { ShopProvider } from './context/ShopContext'
import { AnnouncementBar } from './components/AnnouncementBar'
import { ShopHeader } from './components/ShopHeader'
import { CartDelight } from './components/CartDelight'
import { ListingScrollMemory } from './components/ListingScrollMemory'
import HomePage from './pages/HomePage'
import ProductDetail from './pages/ProductDetail'
import CustomizePlaceholder from './pages/CustomizePlaceholder'
import UploadPage from './pages/UploadPage'
import CustomerFormPage from './pages/CustomerFormPage'
import PaymentPage from './pages/PaymentPage'
import ContactRedirect from './pages/ContactRedirect'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import AdminPage from './pages/AdminPage'

function Providers({ children }) {
  return (
    <ShopProvider>
      <CartProvider>
        <OrderFlowProvider>{children}</OrderFlowProvider>
      </CartProvider>
    </ShopProvider>
  )
}

function AppShell() {
  return (
    <Providers>
      <div className="boutique-shell relative min-h-svh">
        <ListingScrollMemory />
        <AnnouncementBar />
        <ShopHeader />
        <CartDelight />
        <Outlet />
      </div>
    </Providers>
  )
}

function AdminShell() {
  return (
    <Providers>
      <AdminPage />
    </Providers>
  )
}

const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminShell />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'product/:slug', element: <ProductDetail /> },
      { path: 'checkout/customer', element: <CustomerFormPage /> },
      { path: 'checkout/payment', element: <PaymentPage /> },
      {
        path: 'order/confirmation/:orderId',
        element: <OrderConfirmationPage />,
      },
      { path: 'order/:slug/upload', element: <UploadPage /> },
      { path: 'order/:slug/customer', element: <CustomerFormPage /> },
      { path: 'order/:slug/payment', element: <PaymentPage /> },
      { path: 'order/:slug/contact', element: <ContactRedirect /> },
      { path: 'customize/:productId', element: <CustomizePlaceholder /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
