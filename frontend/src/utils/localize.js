export function localizeField(item, baseName, locale = 'ka') {
  const suffix = locale === 'ka' ? 'Ka' : 'En';
  const fallback = locale === 'ka' ? 'En' : 'Ka';
  return item?.[`${baseName}${suffix}`] || item?.[`${baseName}${fallback}`] || '';
}

export function roleLabel(role, t) {
  switch (role) {
    case 'authorized_dealer':
      return t('authorizedDealer');
    case 'architect':
      return t('architect');
    case 'press':
      return t('press');
    case 'admin':
      return 'Admin';
    default:
      return role;
  }
}
