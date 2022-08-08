angular.module('Tissue_Sample_Project')
.filter('ShowDateDDMMYYY', [function() {
    return function(string) {
        if (!angular.isString(string)) {
            return string;
        }
        let pdate = Date.parse(string)
        return moment(new Date(pdate)).format('DD/MM/YYYY')
    };
}])
 
.filter('range', function() {
    return function(input, total) {
      total = parseInt(total);
      for (var i=0; i<total; i++)
        input.push(i);
      return input;
    };
});