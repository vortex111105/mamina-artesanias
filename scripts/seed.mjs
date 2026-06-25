/**
 * Script para cargar productos de prueba en Supabase
 * Uso: node scripts/seed.mjs
 * Requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el entorno
 */
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const products = [
  { name: 'Tazón artesanal azul cobalto', description: 'Tazón de cerámica esmaltada a mano en azul cobalto. Perfecto para cereales, sopas o bowls. Capacidad aprox. 600ml. Cada pieza es única.', price: 3500, stock: 5, image_url: 'https://images.unsplash.com/photo-1565193566082-ef8bb680a8db?w=800&q=80&auto=format&fit=crop', category: 'Cerámica', delivery: ['correo', 'retiro'], accepts_mp: true, visible: true },
  { name: 'Vasija decorativa terracotta', description: 'Vasija de terracota esmaltada con detalles naturales. Ideal para decoración o como florero. Altura 22cm, diámetro boca 8cm.', price: 5200, stock: 3, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop', category: 'Cerámica', delivery: ['correo', 'retiro'], accepts_mp: true, visible: true },
  { name: 'Plato de servir esmaltado verde', description: 'Plato playo en esmalte verde salvia. Apto para lavavajillas y microondas. Diámetro 26cm.', price: 4800, stock: 4, image_url: 'https://images.unsplash.com/photo-1610701596061-2ecf227e9b66?w=800&q=80&auto=format&fit=crop', category: 'Cerámica', delivery: ['correo', 'retiro'], accepts_mp: true, visible: true },
  { name: 'Jarra de cerámica con asa', description: 'Jarra con asa cómoda. Esmalte blanco roto con detalles terracota. Capacidad 1.2 litros.', price: 4200, stock: 6, image_url: 'https://images.unsplash.com/photo-1493219686142-5f91b68a1987?w=800&q=80&auto=format&fit=crop', category: 'Cerámica', delivery: ['correo', 'retiro'], accepts_mp: true, visible: true },
  { name: 'Set 4 tazas espresso', description: 'Juego de 4 tazas espresso con esmaltes diferentes pero complementarios: azul, verde, blanco y ocre. Capacidad 80ml. En caja kraft.', price: 6800, stock: 2, image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80&auto=format&fit=crop', category: 'Cerámica', delivery: ['correo', 'retiro'], accepts_mp: true, visible: true },
  { name: 'Bol pequeño para salsas', description: 'Bol multipropósito para salsas, aceite de oliva o condimentos. Esmalte crema con borde terracota. Diámetro 10cm.', price: 1800, stock: 12, image_url: 'https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?w=800&q=80&auto=format&fit=crop', category: 'Cerámica', delivery: ['correo', 'retiro'], accepts_mp: true, visible: true },
  { name: 'Taza grande café con leche', description: 'Taza amplia ideal para café con leche o té. Esmalte beige con manchas naturales del horneado. Capacidad 350ml.', price: 2900, stock: 8, image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80&auto=format&fit=crop', category: 'Cerámica', delivery: ['correo', 'retiro'], accepts_mp: true, visible: true },
  { name: 'Fuente ovalada para mesa', description: 'Fuente para servir. Esmalte blanco con veteado azul. Medidas 35x22cm. Apta para horno 180°C, lavavajillas y microondas.', price: 7500, stock: 2, image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80&auto=format&fit=crop', category: 'Cerámica', delivery: ['correo', 'retiro'], accepts_mp: true, visible: true },
  { name: 'Maceta colgante pintada a mano', description: 'Maceta de cerámica para colgar con cuerda de macramé incluida. Motivos florales pintados a mano. Diámetro 14cm.', price: 3200, stock: 0, image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80&auto=format&fit=crop', category: 'Decoración', delivery: ['correo', 'retiro'], accepts_mp: true, visible: true },
  { name: 'Candelabro cerámica blanca', description: 'Candelabro bajo con forma orgánica. Cerámica blanca mate. Para velas de hasta 4cm de diámetro o incienso en conos.', price: 2800, stock: 7, image_url: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80&auto=format&fit=crop', category: 'Decoración', delivery: ['correo', 'retiro'], accepts_mp: true, visible: true },
  { name: 'Florero cuello largo mostaza', description: 'Florero alto con cuello largo. Esmalte mostaza. Altura 28cm. Perfecto para ramas secas o pampa grass.', price: 4600, stock: 0, image_url: 'https://images.unsplash.com/photo-1563241527-3f6bc84e93ef?w=800&q=80&auto=format&fit=crop', category: 'Decoración', delivery: ['correo', 'retiro'], accepts_mp: true, visible: true },
  { name: 'Portabudineras con tapa (set x2)', description: 'Set de 2 portabudineras con tapa. Esmalte crema interior, terracota exterior. Aptas para horno. 250ml c/u. Con caja de regalo.', price: 5900, stock: 3, image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop', category: 'Accesorios', delivery: ['correo', 'retiro'], accepts_mp: true, visible: true },
]

async function seed() {
  console.log('Insertando', products.length, 'productos...')
  const { data, error } = await supabase.from('products').insert(products).select()
  if (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
  console.log('✅ Productos insertados:')
  data.forEach(p => console.log(` - [${p.id}] ${p.name} — $${p.price}`))
}

seed()
