function jestNoLess(coverageRequirements, jestOutput) {

    // Validate that we did not receive crud
    for (var key in coverageRequirements) {
        if (coverageRequirements[key] !== false) {
            if (parseInt(coverageRequirements[key]) !== coverageRequirements[key]) {
                throw new TypeError('Parameter ' + key + ' is not an integer (type: ' +
                    typeof(coverageRequirements[key]) + '; value: ' + coverageRequirements[key] + ')');
            } else if (coverageRequirements[key] > 100 || coverageRequirements[key] < 0) {
                throw new TypeError('Parameter ' + key + ' is not an integer between 0 and 100 (value: ' +
                    coverageRequirements[key] + ')');
            }
        }
    }
    
    // Make sure that at least one thing is set so we can be useful
    if (!coverageRequirements.minLines &&
        !coverageRequirements.minFuncs &&
        !coverageRequirements.minStmts) {
        throw new TypeError('Don\'t be lazy. You have to specify at least one of: ' +
            '--min-lines, --min-stmts, --min-funcs.');
    }
    
    // And now the show may begin!
    var coverage = parseJestOutput(jestOutput);
    for (var key in coverageRequirements) {
        if (coverageRequirements[key] !== false) {
            if (coverage[key] < coverageRequirements[key]) {
                console.error('Coverage requirement for ' + key + ' failed. ' +
                    'Desired Coverage: ' + coverageRequirements[key] + '%. ' +
                    'Actual Coverage: ' + coverage[key] + '%. '
                );
                process.exit(1);
            }
        }
    }
    console.log("Code coverage requirements are met.");
}

function parseJestOutput(output) {
    var coverage = {
        minLines: 0,
        minFuncs: 0,
        minStmts: 0
    };
    var lines = output.split('\n');
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].match(/^All files/)) {
            var parts = lines[i].split("|");
            coverage.minStmts = parseFloat(parts[1]);
            coverage.minFuncs = parseFloat(parts[3]);
            coverage.minLines = parseFloat(parts[4]);
            break;
        }
    }
    return coverage;
}

module.exports = jestNoLess