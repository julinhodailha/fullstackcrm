// ——— CORS ——————————————————————————————————————————————————
// Libera para o seu domínio do Netlify e domínio próprio
app.use(cors({
  origin: '*', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors()); // preflight