const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
// Permite que Express sirva archivos estáticos como imágenes y CSS
app.use(express.static(__dirname));
const CSV = path.join(__dirname, 'datos.csv');
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '5kb' }));
app.use(express.static(path.join(__dirname, 'public')));

if (!fs.existsSync(CSV)) fs.writeFileSync(CSV, 'nombre,documento,grado,telefono\n', 'utf8');

const limpiar = (v) => {
  let s = String(v).replace(/[\r\n"]/g, ' ').trim();
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return `"${s}"`;
};

app.post('/api/registro', (req, res) => {
  const { nombre, documento, grado, telefono } = req.body || {};
  const okNombre = typeof nombre === 'string' && /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]{3,25}$/.test(nombre.trim()) && nombre.trim().length >= 3;
  const okDoc = /^\d{10}$/.test(documento);
  const okTel = /^\d{11}$/.test(telefono);
  const okGrado = typeof grado === 'string' && grado.trim().length > 0 && grado.length <= 40;

  if (!okNombre || !okDoc || !okTel || !okGrado) {
    return res.status(400).json({ ok: false, mensaje: 'Datos inválidos' });
  }

  const fila = [limpiar(nombre), limpiar(documento), limpiar(grado), limpiar(telefono)].join(',') + '\n';

  fs.appendFile(CSV, fila, 'utf8', (err) => {
    if (err) return res.status(500).json({ ok: false, mensaje: 'Error al guardar' });
    res.json({ ok: true, mensaje: 'Registro guardado' });
  });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));