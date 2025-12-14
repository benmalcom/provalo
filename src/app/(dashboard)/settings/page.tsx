'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  Textarea,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import {
  LuSave,
  LuCheck,
  LuInfo,
  LuShieldCheck,
  LuFileText,
} from 'react-icons/lu';
import { Header } from '@/components/layout';
import { useUserProfile } from '@/lib/hooks';
import { Avatar } from '@/components/ui/avatar';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { user, updateProfile, isUpdating, isLoading } = useUserProfile();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    displayName: '',
    businessName: '',
    address: '',
    phone: '',
  });

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        businessName: user.businessName || '',
        address: user.address || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <Box>
      <Header title="Settings" />

      <Box p={6}>
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 380px' }}
          gap={6}
          maxW="1000px"
        >
          {/* Left Column - Profile Form */}
          <GridItem>
            <Box
              bg="bg.surface"
              borderRadius="xl"
              border="1px solid"
              borderColor="border.muted"
              p={6}
            >
              <Text fontWeight="600" color="text.primary" mb={6}>
                Profile Information
              </Text>

              <Flex gap={6} mb={6}>
                <Avatar
                  size="xl"
                  name={
                    user?.displayName ||
                    user?.name ||
                    session?.user?.name ||
                    'U'
                  }
                  src={session?.user?.avatar || undefined}
                />
                <VStack align="start" justify="center" gap={1}>
                  <Text fontWeight="500" color="text.primary">
                    {user?.displayName ||
                      user?.name ||
                      session?.user?.name ||
                      'User'}
                  </Text>
                  <Text fontSize="sm" color="text.secondary">
                    {session?.user?.email}
                  </Text>
                </VStack>
              </Flex>

              <form onSubmit={handleSubmit}>
                <VStack gap={5} align="stretch">
                  {/* Display Name */}
                  <Box>
                    <HStack mb={2}>
                      <Text fontSize="sm" fontWeight="500" color="text.primary">
                        Display Name
                      </Text>
                      <Text fontSize="xs" color="primary.500">
                        Required
                      </Text>
                    </HStack>
                    <Input
                      placeholder="Your full legal name"
                      value={formData.displayName}
                      onChange={e =>
                        handleChange('displayName', e.target.value)
                      }
                      bg="bg.canvas"
                      size="lg"
                    />
                    <Text fontSize="xs" color="text.tertiary" mt={1}>
                      This name will appear on your income reports
                    </Text>
                  </Box>

                  {/* Business Name */}
                  <Box>
                    <HStack mb={2}>
                      <Text fontSize="sm" fontWeight="500" color="text.primary">
                        Business Name
                      </Text>
                      <Text fontSize="xs" color="text.tertiary">
                        Optional
                      </Text>
                    </HStack>
                    <Input
                      placeholder="Your company or business name"
                      value={formData.businessName}
                      onChange={e =>
                        handleChange('businessName', e.target.value)
                      }
                      bg="bg.canvas"
                      size="lg"
                    />
                    <Text fontSize="xs" color="text.tertiary" mt={1}>
                      For freelancers and contractors
                    </Text>
                  </Box>

                  {/* Address */}
                  <Box>
                    <HStack mb={2}>
                      <Text fontSize="sm" fontWeight="500" color="text.primary">
                        Address
                      </Text>
                      <Text fontSize="xs" color="text.tertiary">
                        Optional
                      </Text>
                    </HStack>
                    <Textarea
                      placeholder="Your address for official documents"
                      value={formData.address}
                      onChange={e => handleChange('address', e.target.value)}
                      bg="bg.canvas"
                      rows={2}
                      resize="none"
                    />
                    <Text fontSize="xs" color="text.tertiary" mt={1}>
                      Used for visa and rental applications
                    </Text>
                  </Box>

                  {/* Phone */}
                  <Box>
                    <HStack mb={2}>
                      <Text fontSize="sm" fontWeight="500" color="text.primary">
                        Phone Number
                      </Text>
                      <Text fontSize="xs" color="text.tertiary">
                        Optional
                      </Text>
                    </HStack>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      bg="bg.canvas"
                      size="lg"
                    />
                    <Text fontSize="xs" color="text.tertiary" mt={1}>
                      Contact number for verification purposes
                    </Text>
                  </Box>

                  {/* Submit Button */}
                  <Flex justify="flex-end" pt={2}>
                    <Button
                      type="submit"
                      bg={saved ? 'green.500' : 'primary.500'}
                      color="white"
                      size="lg"
                      px={6}
                      _hover={{ bg: saved ? 'green.600' : 'primary.600' }}
                      disabled={isUpdating || isLoading}
                    >
                      <HStack gap={2}>
                        {saved ? <LuCheck size={18} /> : <LuSave size={18} />}
                        <Text>
                          {isUpdating
                            ? 'Saving...'
                            : saved
                              ? 'Saved!'
                              : 'Save Changes'}
                        </Text>
                      </HStack>
                    </Button>
                  </Flex>
                </VStack>
              </form>
            </Box>
          </GridItem>

          {/* Right Column - Info Cards */}
          <GridItem>
            <VStack gap={4} align="stretch">
              {/* About Your Information */}
              <Box
                bg="bg.surface"
                borderRadius="xl"
                border="1px solid"
                borderColor="border.muted"
                p={5}
              >
                <HStack align="start" gap={3} mb={3}>
                  <Box color="primary.500" mt={0.5}>
                    <LuInfo size={18} />
                  </Box>
                  <Text fontWeight="500" color="text.primary">
                    About Your Information
                  </Text>
                </HStack>
                <Text fontSize="sm" color="text.secondary" lineHeight="tall">
                  The information you provide will appear on your generated
                  income reports. This helps banks, landlords, and immigration
                  authorities verify your identity.
                </Text>
              </Box>

              {/* Security Info */}
              <Box
                bg="bg.surface"
                borderRadius="xl"
                border="1px solid"
                borderColor="border.muted"
                p={5}
              >
                <HStack align="start" gap={3} mb={3}>
                  <Box color="green.500" mt={0.5}>
                    <LuShieldCheck size={18} />
                  </Box>
                  <Text fontWeight="500" color="text.primary">
                    Data Security
                  </Text>
                </HStack>
                <Text fontSize="sm" color="text.secondary" lineHeight="tall">
                  All your data is encrypted at rest and in transit. We never
                  share your information without your explicit consent.
                </Text>
              </Box>

              {/* Report Usage */}
              <Box
                bg="bg.surface"
                borderRadius="xl"
                border="1px solid"
                borderColor="border.muted"
                p={5}
              >
                <HStack align="start" gap={3} mb={3}>
                  <Box color="blue.500" mt={0.5}>
                    <LuFileText size={18} />
                  </Box>
                  <Text fontWeight="500" color="text.primary">
                    Report Generation
                  </Text>
                </HStack>
                <Text fontSize="sm" color="text.secondary" lineHeight="tall">
                  Your profile information will be included in PDF reports
                  generated for visa applications, rental agreements, and loan
                  applications.
                </Text>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
