import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { OrderFlowProvider } from './context/OrderFlowContext'
import { ShopProvider } from './context/ShopContext'
import { AnnouncementBar } from './components/AnnouncementBar'
import { ShopHeader } from './components/ShopHeader'
import { CartDelight } from './components/CartDelight'
import { ListingScrollMemory } from './components/ListingScrollMemory'
import { BoutiqueCursor } from './components/BoutiqueCursor'
import HomePage from './pages/HomePage'
import ProductDetail from './pages/ProductDetail'
import CustomizePlaceholder from './pages/CustomizePlaceholder'
import UploadPage from './pages/UploadPage'
import CustomerFormPage from './pages/CustomerFormPage'
import PaymentPage from './pages/PaymentPage'
import ContactRedirect from './pages/ContactRedirect'

function AppShell() {
  return (
    <ShopProvider>
      <CartProvider>
        <OrderFlowProvider>
          <div className="boutique-shell relative min-h-svh">
            <BoutiqueCursor />
            <ListingScrollMemory />
            <AnnouncementBar />
            <ShopHeader />
            <CartDelight />
            <Outlet />
          </div>
        </OrderFlowProvider>
      </CartProvider>
    </ShopProvider>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'product/:slug', element: <ProductDetail /> },
      { path: 'checkout/customer', element: <CustomerFormPage /> },
      { path: 'checkout/payment', element: <PaymentPage /> },
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
