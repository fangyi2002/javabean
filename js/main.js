(function () {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
})();

(function () {
    var quizToggle = document.getElementById('quiz-toggle-btn');
    var quizBox = document.querySelector('.quiz-box');
    var quizContent = document.getElementById('quiz-content');
    var toggleIcon = quizToggle ? quizToggle.querySelector('.toggle-icon') : null;
    
    if (quizToggle && quizBox && quizContent && toggleIcon) {
        quizToggle.addEventListener('click', function() {
            var isExpanded = quizToggle.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                quizBox.classList.add('collapsed');
                quizToggle.setAttribute('aria-expanded', 'false');
                quizToggle.querySelector('.sr-only').textContent = 'Expand quiz';
                toggleIcon.textContent = '+';
            } else {
                quizBox.classList.remove('collapsed');
                quizToggle.setAttribute('aria-expanded', 'true');
                quizToggle.querySelector('.sr-only').textContent = 'Collapse quiz';
                toggleIcon.textContent = '−';
            }
        });
    }
})();

(function () {
    var quizForm = document.getElementById('quiz-form');
    var quizResult = document.getElementById('quiz-result');
    
    if (quizForm && quizResult) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var strength = document.getElementById('strength').value;
            var milk = document.getElementById('milk').value;
            var sweet = document.getElementById('sweet').value;
            var temp = document.getElementById('temp').value;
            
            var drink = getDrinkRecommendation(strength, milk, sweet);
            var finalRecommendation = applyTemperature(drink, temp);
            
            displayResult(finalRecommendation);
            quizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
    
    function getDrinkRecommendation(strength, milk, sweet) {
        if (strength === 'mild') {
            if (milk === 'none') {
                if (sweet === 'no') {
                    return 'Light Americano';
                } else if (sweet === 'sometimes') {
                    return 'Honey Americano';
                } else {
                    return 'Iced/light Cold Brew with Sweet Foam';
                }
            } else if (milk === 'some') {
                if (sweet === 'no') {
                    return 'Café au Lait';
                } else if (sweet === 'sometimes') {
                    return 'Flat White (light roast)';
                } else {
                    return 'Vanilla Latte (light roast)';
                }
            } else {
                if (sweet === 'no') {
                    return 'Steamed Milk + 1 Shot Latte / Cortado';
                } else if (sweet === 'sometimes') {
                    return 'Mocha (light chocolate)';
                } else {
                    return 'Caramel Latte';
                }
            }
        }
        
        if (strength === 'medium') {
            if (milk === 'none') {
                if (sweet === 'no') {
                    return 'Drip Coffee / Pour-over';
                } else if (sweet === 'sometimes') {
                    return 'Brown Sugar Americano';
                } else {
                    return 'Mocha / Sweetened Cold Brew';
                }
            } else if (milk === 'some') {
                if (sweet === 'no') {
                    return 'Cappuccino';
                } else if (sweet === 'sometimes') {
                    return 'Latte';
                } else {
                    return 'Caramel Macchiato';
                }
            } else {
                if (sweet === 'no') {
                    return 'Café Breve';
                } else if (sweet === 'sometimes') {
                    return 'Honey Latte';
                } else {
                    return 'White Chocolate Mocha';
                }
            }
        }
        
        if (strength === 'strong') {
            if (milk === 'none') {
                if (sweet === 'no') {
                    return 'Espresso / Ristretto';
                } else if (sweet === 'sometimes') {
                    return 'Café Cubano';
                } else {
                    return 'Espresso with Sweet Foam / Affogato';
                }
            } else if (milk === 'some') {
                if (sweet === 'no') {
                    return 'Macchiato';
                } else if (sweet === 'sometimes') {
                    return 'Cortado';
                } else {
                    return 'Spanish Latte (sweetened condensed milk)';
                }
            } else {
                if (sweet === 'no') {
                    return 'Flat White (strong shots)';
                } else if (sweet === 'sometimes') {
                    return 'Mocha with extra espresso';
                } else {
                    return 'Vietnamese Iced Coffee';
                }
            }
        }
        
        return 'Coffee';
    }
    
    function applyTemperature(drink, temp) {
        var drinkLower = drink.toLowerCase();
        var inherentlyIced = drinkLower.includes('cold brew') || drinkLower.includes('vietnamese iced');
        var canBeBoth = drinkLower.includes('latte') || 
                       drinkLower.includes('mocha') || 
                       drinkLower.includes('americano') || 
                       drinkLower.includes('macchiato') || 
                       drinkLower.includes('cappuccino') ||
                       drinkLower.includes('cortado') ||
                       drinkLower.includes('flat white');
        var typicallyHot = drinkLower.includes('espresso') || 
                          drinkLower.includes('ristretto') || 
                          drinkLower.includes('café cubano') ||
                          drinkLower.includes('café au lait') ||
                          drinkLower.includes('café breve') ||
                          drinkLower.includes('drip coffee') ||
                          drinkLower.includes('pour-over') ||
                          drinkLower.includes('affogato') ||
                          drinkLower.includes('steamed milk');
        
        if (temp === 'hot') {
            if (inherentlyIced) {
                if (drinkLower.includes('cold brew')) {
                    return drink.replace(/Iced\/?light /gi, '').replace(/Cold Brew with Sweet Foam/gi, 'Hot Coffee with Sweet Foam').trim();
                }
                return drink;
            }
            if (canBeBoth && !drinkLower.includes('hot') && !drinkLower.includes('iced')) {
                return 'Hot ' + drink;
            }
            if (drinkLower.includes('iced')) {
                return drink.replace(/Iced /gi, '').replace(/Iced\/?/gi, '').trim();
            }
            return drink;
        } else if (temp === 'iced') {
            if (inherentlyIced) {
                return drink;
            }
            if (canBeBoth && !drinkLower.includes('iced')) {
                var baseDrink = drink.replace(/Hot /gi, '').trim();
                return 'Iced ' + baseDrink;
            }
            if (typicallyHot && (drinkLower.includes('latte') || drinkLower.includes('mocha') || drinkLower.includes('americano') || drinkLower.includes('macchiato'))) {
                return 'Iced ' + drink;
            }
            return drink;
        } else {
            if (canBeBoth) {
                var baseDrink = drink.replace(/Hot /gi, '').replace(/Iced /gi, '').replace(/Iced\/?/gi, '').trim();
                baseDrink = baseDrink.replace(/^hot /gi, '').replace(/^iced /gi, '');
                return 'You might like either a hot ' + baseDrink.toLowerCase() + ' or an iced ' + baseDrink.toLowerCase() + ' depending on your mood!';
            }
            if (inherentlyIced) {
                return drink;
            }
            return drink;
        }
    }
    
    function displayResult(recommendation) {
        quizResult.innerHTML = '<h3>Your Perfect Drink:</h3><p><strong>' + recommendation + '</strong></p>';
    }
})();