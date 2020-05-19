module.exports = {
  blocks: {
    codesandbox: {
      process: function(block) {
        if (!/codesandbox\.io/.test(block.body)) { return block.body }

        return `
          <iframe
            src=${block.body}
            style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
            sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin">
          </iframe>
        `
      }
    }
  }
}
