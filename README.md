# Minutia

Unit converting library

I made this because existing unit converter libraries didn't do what I needed.  Specifically, I needed full string parsing.

This currently only supports length and mass/weight units.  Please open an issue if you need others.

## Example

    console.log(minutia('5kg').to('lbs'))   // 11.023113
    console.log(minutia('5ft 10"').to('m')) // 1.77799999 (note you can do several units within one string!)
