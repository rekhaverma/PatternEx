export default (tag) => {
  switch (tag.toLowerCase()) {
    case 'tod abuse':
      return '#204742';

    case 'delivery':
      return '#3e987a';

    case 'discovery':
      return '#bfb663';

    case 'exfiltration':
      return '#f9c757';

    case 'hpa':
      return '#f6a938';

    case 'cc fraud':
      return '#2678b4';

    case 'benign':
      return '#B93740';

    case 'denial of service':
      return '#574B90';

    case 'lateral movement':
      return '#67809F';

    case 'command and control':
      return '#F2784B';

    case 'credential access':
      return '#227093';

    case 'ato':
      return '#4B77BE';

    case 'unknown':
      return '#947CB0';

    default:
      return '#3498DB';
  }
};
