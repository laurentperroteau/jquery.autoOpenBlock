
jQuery Auto Open Block
======================

### Automates the opening and closing blocks ###

### Explanation (in french at the moment) : ###

> Automatise après un évenement l'ajout et la suppression de classe sur un élément tiers (utile pour grand site) : 
> _en pratique, ceci permet au clic l'ouverture et la fermeture de bloc, [voir exemple](http://codepen.io/laurentperroteau/pen/IFmvy)._


Ce que permet le plugin
-----------------------

Lexique : le __trigger__ est l'élement où l'on click pour ouvrir un block, le __block__ est l'élément ouvert au click sur le trigger et le __nom du block__ est l'ID commune renseigné dans les attributs data.

- Plusieurs trigger peuvent ouvrir un même block
- Un trigger ne peut pas ouvrir plusieurs block
- Au click sur un trigger, on peut fermer un ou plusieurs block : [voir exemple](http://codepen.io/laurentperroteau/pen/Consr/)
- On peut ouvrir/fermer les block "manuelement"
- À la fermeture d'un block, une classe "is-close" est ajouté pour l'utilisation des keyframes : [voir exemple](http://codepen.io/laurentperroteau/pen/olDqf)
- On peut ajouter des triggers et des blocks après chargement de la page
- On peut détruire tous les évenement ou celui d'un trigger en particulier
- Au click sur un trigger, on peut exécuter une méthode externe avant et/ou après l'ouverture du block
- On peut mettre un autre évenement que click


Installation
------------

````html
<a href="#" data-trigger-elem="block">Trigger</a>

<!-- Le nom du block doit être identique -->
<div data-open-elem="block">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
</div>

<script type="text/javascript" src="jquery-lastest-version.js"></script>
<script type="text/javascript" src="jquery.autoOpenBlock.js"></script>
<script>
    $(function() {
        $.autoOpenningBlock(); // c'est tout
    });
</script>
````


Documentation
-------------

#### Changer les paramètres par défault : ####

````javascript
$.autoOpenningBlock({
    openClass:      'is-open',        // la class ajouté au block quand ouvert
    closeClass:     'is-close',       // la class ajouté au block quand fermé
    triggerElem:    'trigger-elem',   // [data-trigger-elem], pour le trigger
    openElem:       'open-elem',      // [data-open-elem], pour le block
    closing:        'closing',        // [data-closing], contiendra les block à fermé
    beforeTrigger:  'before-trigger', // [data-before-trigger], méthode a appeler avant ouverture
    afterTrigger:   'after-trigger',  // [data-after-trigger], méthode a appeler après ouverture
    onEvent:        'click'           // changer l'évenement
});
````

#### A l'ouverture d'un block, on peut en fermer d'autres : ####

````html
<!-- A click sur ce trigger, il fermera aussi le block renseigné dans [data-closing] -->
<a href="#" data-trigger-elem="block" data-closing="secondBlock">Trigger</a>

<!-- Possibilité de renseigner plusieurs block -->
<a href="#" data-trigger-elem="block" data-closing='["secondBlock", "thirdBlock"]'>Trigger</a>
````

````javascript
// On peut ajouter "manuelement" ces block à fermer
$('[data-trigger-elem=block]').data('closing', 'secondBlock');
````


#### Ouvrir ou fermer "manuelement un block" : ####

````javascript
// où "menu" est le nom du block
$.autoOpenningBlock('openElem', 'menu'); 
$.autoOpenningBlock('closeElem', 'menu');
````


#### Ajouter un évenement à la liste de trigger après chargement (après insertion) : ####

````javascript
// où "#newBlock" est le sélecteur du trigger
$.autoOpenningBlock('newElement', '#newBlock'); 

// où "change" est le nouvel évenement"
$.autoOpenningBlock('newElement', '#newBlock', 'change'); 
````


#### Détruire les évenements : ####

````javascript
// détruit tous les évenements
$.autoOpenningBlock('destroy'); 

// détruit seulement l'évenement sur le trigger renseigné
$.autoOpenningBlock('destroy', $('#destroy') ); 
````


#### Exécuter une méthode externe avant et/ou après l'ouverture du block : ####

````html
<!-- A click sur ce trigger, avant l'ouverture du block, Master.doSomething() sera appelé -->
<a href="#" data-trigger-elem="block" data-before-open="Master.doSomething">Trigger</a>

<!-- Après l'ouverture du block, Master.doSomethingElse() sera appelé -->
<a href="#" data-trigger-elem="block" data-before-open="Master.doSomethingElse">Trigger</a>
````