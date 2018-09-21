document.addEventListener('DOMContentLoaded', function() {
  let years = {};
  for(let i = 2019; i > 1949; i--) {
    years[i] = null;
  }
  
  let acElems = document.getElementById('yearAutocomplete');
  
  let acOptions = {
    data: years,
    sortFunction: function(a, b, inputString) {
      return Number(a) - Number(b);
    },
    onAutocomplete: function() {
     _select(document.getElementById('makeAutocomplete'));
    }
  };
  
  let searchPlaceholder = document.getElementById('searchPlaceholder');
  acElems.addEventListener('focus', function() {
    searchPlaceholder.style.display = 'none';
    acElems.addEventListener('blur', function() {
      if(acElems.value === '') {
        searchPlaceholder.style.display = 'block';
      }
    });
  });
  
  let acInstances = M.Autocomplete.init(acElems, acOptions);
  
  function _select(el) {
    el.focus();
    let options;
    if(el.id === 'makeAutocomplete') {
      options = {
        data: {
          'Acura': null,
          'Chevrolet': null,
          'Ford': null
        },
        onAutocomplete: function() {
          _select(document.getElementById('modelAutocomplete'));
        }
      };
    } else {
      options = {
        data: {
          'Focus': null,
          'Mustang': null,
          'Explorer': null
        },
        onAutocomplete: function() {
          _select(document.getElementById('modelAutocomplete'));
        }
      };
    }
    
    let elem = el;
    let instance = M.Autocomplete.init(elem, options);
  }
  
  // var acElems = document.querySelectorAll('.autocomplete');
  // var instance = M.Autocomplete.getInstance(acElems[0]);
  // instance.destroy();
  // let acOptions = {
  //   data: {
  //     'Acura': null,
  //     'Chevrolet': null,
  //     'Ford': null
  //   },
  //   onAutocomplete: onAutocomplete
  // };
  // var acElems = document.querySelectorAll('.autocomplete');
  // var acInstances = M.Autocomplete.init(acElems, acOptions);
});