
function type(d) {
  d.attack = +d.Attack;
  d.defense = +d.Defense;
  d.hp = +d.HP;
  d.speed = +d.Speed;
  d.spAttack = d['Sp. Atk'];
  d.spDefense = d['Sp. Def'];
  d.type = d['Type 1'];

  d.x = d.attack;
  d.y = d.defense;
  return d;
}

d3.csv('pokemon.csv', type, function(error, data) {

    if (error) {
        console.error(error)
        return;
    }
    var dataset = new Plottable.Dataset(data);
    // Declare x and y scale for use by the plot.
    var xScale = new Plottable.Scales.Linear();
    var yScale = new Plottable.Scales.Linear();

    var xAxis = new Plottable.Axes.Numeric(xScale, 'bottom');
    var yAxis = new Plottable.Axes.Numeric(yScale, 'left');
     
    var plot = new Plottable.Plots.Scatter()
        .x(function(d) {
            return d.x;
        }, xScale)
        .y(d => d.y, yScale)
        .attr("fill", function(d) {
            switch(d.type) {
                case 'Grass':
                    return 'green';
                case 'Fire':
                    return 'red';
                case 'Normal':
                    return 'brown';
                default:
                    return 'blue';
            }
        })
        .addDataset(dataset);
    
    var xInput = document.getElementById('x-input');
    var yInput = document.getElementById('y-input');

    xInput.addEventListener('change', function(event) {
        var attribute = event.target.value;
        var oldData = dataset.data();
        dataset.data(oldData.map(d => {
            d.x = d[attribute];
            return d;
        }));
        console.log(attribute);
    });
    yInput.addEventListener('change', function(event) {
        var attribute = event.target.value;
        var oldData = dataset.data();
        dataset.data(oldData.map(d => {
            d.y = d[attribute];
            return d;
        }));
        console.log(attribute);
    });
    

    var chart = new Plottable.Components.Table([
        [yAxis, plot],
        [null, xAxis]
    ]);

    chart.renderTo('svg#chart');
});