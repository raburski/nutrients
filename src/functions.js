export function downloadString(text, fileType, fileName) {
    var blob = new Blob([text], { type: fileType });
  
    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
}

export function uploadFile(extension = ".json") {
    return new Promise(resolve => {
      const inputFileElement = document.createElement('input')
      inputFileElement.setAttribute('type', 'file')
      inputFileElement.setAttribute('multiple', 'false')
      inputFileElement.setAttribute('accept', extension)
      
      inputFileElement.addEventListener(
        'change',
        async (event) => {
          const { files } = event.target
          if (!files) {
            return
          }
  
          const filePromises = [...files].map(file => file.text())
  
          resolve(await Promise.all(filePromises))
        },
        false,
      )
      inputFileElement.click()
    })
  }