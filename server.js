const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// صفحة رئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// صفحة لمشروع محدد (مهم)
app.get('/project/:projectId/task/new', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API مع دعم projectId
app.post('/api/tasks', (req, res) => {
    console.log('📝 Nouvelle tâche reçue:');
    console.log('   - Titre: ' + req.body.title);
    console.log('   - Description: ' + req.body.description);
    console.log('   - Priorité: ' + req.body.priority);
    console.log('   - Statut: ' + req.body.status);
    console.log('   - Project ID: ' + req.body.projectId);
    
    res.json({ 
        success: true, 
        message: 'Tâche créée avec succès',
        task: req.body 
    });
});

app.listen(PORT, () => {
    console.log('✅ Serveur sur http://localhost:' + PORT);
});