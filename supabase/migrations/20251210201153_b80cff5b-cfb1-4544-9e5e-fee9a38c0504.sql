-- Update industry name from DTC to Ecommerce
UPDATE public.industries 
SET name = 'Ecommerce' 
WHERE type = 'dtc';

-- Update persona name from Ecommerce to Leadership
UPDATE public.personas 
SET name = 'Leadership' 
WHERE type = 'ecommerce';