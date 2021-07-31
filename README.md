# Billed

***Projet n°9*** de la formation OpenClassrooms "Développeur Front End"

***Intitulé*** : Débuggez et testez un SaaS RH

Ici j'intègre Billed au sein de la feature team pour fiabiliser et améliorer le parcours employé de leurs fonctionnalités (fixer certains bugs puis mettre en place des tests unitaires et d’intégration)

[Fonctionnalités](https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/Front-End+V2/P7+Tests/Billed+-+Description+des+fonctionnalite%CC%81s.pdf)  | 
[Kanban bugs/tests](https://www.notion.so/a7a612fc166747e78d95aa38106a55ec?v=2a8d3553379c4366b6f66490ab8f0b90)


**Lancer l'application en local** :

Clonez le projet :
```
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR.git
```

Allez au repo cloné :
```
$ cd Billed-app-FR
```

Installez les packages npm (décrits dans `package.json`) :
```
$ npm install
```

Installez live-server pour lancer un serveur local :
```
$ npm install -g live-server
```

Lancez l'application :
```
$ live-server
```

Puis allez à l'adresse : `http://127.0.0.1:8080/`


**Lancer tous les tests en local avec Jest :**

```
$ npm run test
```

**Lancer un seul test :**

Installez jest-cli :

```
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
```

**Voir la couverture de test :**

`http://127.0.0.1:8080/coverage/lcov-report/`
