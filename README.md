# jezd
### Alias the latest ZEIT Now deployment & optionally cleanup

1. [Install](#install)
1. [Usage](#usage)
1. [GitHub Action Example](#github-action-example)
1. [License](#license)

---

## Install
```sh
npm i -g felixheck/jezd
```

## Usage
```sh
Usage: jezd [options] <fqdn...>

Alias the latest deployment to one or multiple `fqdn`

Options:
  -V, --version             output the version number
  -t, --token <token>       ZEIT Now token
  -b, --cleanup-before      remove unaliased deployments before
  -a, --cleanup-afterwards  remove unaliased deployments afterwards
  -h, --help                output usage information
```

You need to be logged in or pass a token.

## GitHub Action Example

- Cleanup all unaliased deployments first
- Push to `master`: deploy and alias to `foobar.com`
- Push to another branch: deploy and alias to `foobar.dev`
- **Result:**
    - A *dev* & *prod* environment
    - The last state which was aliased before the deployment for easy rollbacks 

```yaml
on: push
name: daheq
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - uses: actions/setup-node@v1
      with:
        node-version: '10.x'
    - name: install
      run: npm i && npm i -g --ignore-scripts now && now -v
    - name: install jezd
      run: npm i -g felixheck/jezd && jezd -V
    - name: generate static files
      run: npm run build
    - name: deploy static files
      run: now --token=${{ secrets.ZEIT_TOKEN }} -A ../now.json dist/
    - name: alias to .dev
      run: jezd --token=${{ secrets.ZEIT_TOKEN }} -b foobar.dev
      if: "!contains(github.ref, 'master')"
    - name: alias to .com
      run: jezd --token=${{ secrets.ZEIT_TOKEN }} -b foobar.com
      if: contains(github.ref, 'master')

```

## License
The MIT License

Copyright (c) 2019 Felix Heck

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
